'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { DeleteRecordModal } from '@/modules/profile/components/delete-record-modal';
import { ProfileRecordsTable } from '@/modules/profile/components/profile-records-table';
import { PROFILE_RECORDS_MOCK, SECTION_LABELS } from '@/modules/profile/data/profile-records-data';
import { DeleteRecordException, deleteProfileRecord } from '@/modules/profile/services/profile-records-service';
import type {
  DeleteRecordErrorCode,
  ProfileRecord,
  ProfileRecords,
  RecordSection,
} from '@/modules/profile/types/profile-record';
import { removeProfileRecord } from '@/modules/profile/utils/remove-profile-record';
import { cn } from '@/shared/utils/cn';

const SECTIONS: RecordSection[] = ['education', 'experience', 'certification'];
const TOAST_DURATION_MS = 3000;

type ProfileRecordsManagerProps = {
  initialRecords?: ProfileRecords;
};

export function ProfileRecordsManager({ initialRecords = PROFILE_RECORDS_MOCK }: ProfileRecordsManagerProps) {
  const [records, setRecords] = useState<ProfileRecords>(initialRecords);
  const [activeSection, setActiveSection] = useState<RecordSection>('education');
  const [recordToDelete, setRecordToDelete] = useState<ProfileRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<DeleteRecordErrorCode | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!isToastVisible) return;
    const timeoutId = setTimeout(() => setIsToastVisible(false), TOAST_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, [isToastVisible]);

  function openDeleteModal(record: ProfileRecord) {
    setDeleteError(null);
    setRecordToDelete(record);
  }

  function closeDeleteModal() {
    setRecordToDelete(null);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!recordToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProfileRecord(recordToDelete);
      // Se actualiza solo la lista en memoria, sin recargar la pantalla
      setRecords((current) => ({
        ...current,
        [activeSection]: removeProfileRecord(current[activeSection], recordToDelete.id),
      }));
      setRecordToDelete(null);
      setIsToastVisible(true);
    } catch (error) {
      setDeleteError(error instanceof DeleteRecordException ? error.code : 'network');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-umss-terracotta">Administrar perfil</p>
        <h1 className="text-[28px] font-bold leading-tight text-umss-navy md:text-[34px]">
          Mis registros del perfil
        </h1>
        <p className="text-sm text-umss-navy/70">Edita o elimina tu información profesional.</p>
      </header>

      <div role="tablist" aria-label="Secciones del perfil" className="flex gap-6 overflow-x-auto border-b border-umss-sand">
        {SECTIONS.map((section) => {
          const isActive = section === activeSection;
          return (
            <button
              key={section}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSection(section)}
              className={cn(
                '-mb-px whitespace-nowrap border-b-2 pb-2.5 text-sm transition',
                isActive
                  ? 'border-umss-terracotta font-bold text-umss-navy'
                  : 'border-transparent font-medium text-umss-navy/60 hover:text-umss-navy',
              )}
            >
              {SECTION_LABELS[section]}
            </button>
          );
        })}
      </div>

      <ProfileRecordsTable section={activeSection} records={records[activeSection]} onDelete={openDeleteModal} />

      {recordToDelete && (
        <DeleteRecordModal
          section={activeSection}
          record={recordToDelete}
          isDeleting={isDeleting}
          errorCode={deleteError}
          onConfirm={handleConfirmDelete}
          onCancel={closeDeleteModal}
        />
      )}

      {isToastVisible && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-umss-ink px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <Check className="h-4 w-4 text-umss-orange" aria-hidden="true" />
          Registro eliminado
        </div>
      )}
    </div>
  );
}
