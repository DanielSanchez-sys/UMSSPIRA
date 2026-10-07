'use client';

import React, { useState } from 'react';
import {
  DocumentTypeSelect,
  DocumentType,
} from '@/modules/documents/frontend/components/document-type-select';
import { DocumentDropzone } from '@/modules/documents/frontend/components/document-dropzone';
import { Button } from '@/shared/components/button';
import { ShieldCheck, FileCheck2, ArrowRight } from 'lucide-react';

export default function DocumentUploadPage() {
  const [docType, setDocType] = useState<DocumentType | null>('TITULO_PROVISION_NACIONAL');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isReady = Boolean(docType && file && !errorMessage);

  return (
    <main className="min-h-[calc(100vh-144px)] bg-palladian px-4 py-8 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-oatmeal bg-white p-6 sm:p-10 shadow-sm text-abyssal space-y-6">
        {/* Encabezado Institucional */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-palladian text-blue-fantastic">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <span className="inline-block rounded-full bg-palladian px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-truffle-trouble mb-2">
            Paso 3 de 3 · Respaldo Académico
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-abyssal tracking-tight">
            Carga de Respaldo Institucional
          </h1>
          <p className="mt-2 text-sm text-abyssal/75 max-w-md mx-auto">
            Sube tu título o diploma digitalizado para completar la verificación institucional del titulado.
          </p>
        </div>

        {/* 1. Selector de Tipo de Documento */}
        <DocumentTypeSelect
          value={docType}
          onChange={(newType) => setDocType(newType)}
        />

        {/* 2. Zona de arrastre / Dropzone */}
        <DocumentDropzone
          file={file}
          onFileSelect={(selected) => setFile(selected)}
          error={errorMessage}
          onErrorChange={(err) => setErrorMessage(err)}
        />

        {/* 3. Botón de acción */}
        <Button
          type="button"
          variant="primary"
          disabled={!isReady}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
        >
          <span>Confirmar y Enviar Solicitud</span>
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Pie de seguridad */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-abyssal/60 uppercase tracking-wider pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Validación Oficial de Titulados · FCyT UMSS</span>
        </div>
      </div>
    </main>
  );
}
