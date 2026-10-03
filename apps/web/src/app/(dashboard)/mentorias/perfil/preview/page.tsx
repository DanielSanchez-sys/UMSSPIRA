import { notFound } from 'next/navigation';
import { MentorProfilePreview } from '../_components/mentor-profile-preview';

export default function MentorProfilePreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return (
    <main className="mentorias-shell">
      <MentorProfilePreview />
    </main>
  );
}
