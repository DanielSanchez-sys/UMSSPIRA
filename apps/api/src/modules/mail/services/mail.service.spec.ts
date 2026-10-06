/// <reference types="jest" />
import { ServiceUnavailableException } from '@nestjs/common';
import { MailService } from './mail.service';
import type { MailConfig } from '../mail.config';

describe('MailService', () => {

  let mailService: MailService;
  let mockTransporter: { sendMail: jest.Mock };
  const mockConfig: MailConfig = {
    host: 'localhost',
    port: 1025,
    secure: false,
    fromName: 'Comunidad de Egresados UMSS',
    fromAddress: 'no-reply@portal-egresados.local',
  };

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    };
    mailService = new MailService(mockTransporter as any, mockConfig);
  });

  it('renderiza plantillas y envia el codigo de verificacion por SMTP', async () => {
    await mailService.sendOtpVerification({
      to: 'egresado@umss.edu.bo',
      code: '741852',
      expiresInMinutes: 5,
    });

    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    const sentMessage = mockTransporter.sendMail.mock.calls[0][0];

    expect(sentMessage.to).toBe('egresado@umss.edu.bo');
    expect(sentMessage.subject).toBe('Tu código de verificación');
    expect(sentMessage.from).toEqual({
      name: 'Comunidad de Egresados UMSS',
      address: 'no-reply@portal-egresados.local',
    });
    // Verifica que el HTML contiene el codigo y el tiempo de expiracion
    expect(sentMessage.html).toContain('741852');
    expect(sentMessage.html).toContain('5 minutos');
    // Verifica la version en texto plano
    expect(sentMessage.text).toContain('741852');
    expect(sentMessage.text).toContain('5 minutos');
  });

  it('escapa caracteres especiales en HTML para prevenir inyeccion', async () => {
    await mailService.sendOtpVerification({
      to: 'egresado@umss.edu.bo',
      code: '<script>alert("hack")</script>',
      expiresInMinutes: 5,
    });

    const sentMessage = mockTransporter.sendMail.mock.calls[0][0];
    expect(sentMessage.html).not.toContain('<script>');
    expect(sentMessage.html).toContain('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;');
  });

  it('lanza ServiceUnavailableException si el envio SMTP falla', async () => {
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Connection refused'));

    await expect(
      mailService.sendOtpVerification({
        to: 'egresado@umss.edu.bo',
        code: '123456',
        expiresInMinutes: 5,
      }),
    ).rejects.toThrow(ServiceUnavailableException);
  });
});