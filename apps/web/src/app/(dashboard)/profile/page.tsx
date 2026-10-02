import Timeline from '@/shared/components/timeline';
import { profileTimeline } from '@/modules/profile/data/profile-data';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#eeeade] px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="px-2 py-4 md:px-6 md:py-6">
          <Timeline sections={profileTimeline} />
        </div>
      </div>
    </main>
  );
}