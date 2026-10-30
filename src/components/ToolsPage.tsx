import React from 'react';

interface ToolsPageProps {
  onBack?: () => void;
}

// Halaman Kumpulan Tools / Menu - Dikosongkan sesuai permintaan
export const ToolsPage: React.FC<ToolsPageProps> = () => {
  return (
    <div className="min-h-screen w-full bg-notebook-grid selection:bg-indigo-500 selection:text-white flex flex-col justify-between pb-28">
      <div className="w-full max-w-5xl mx-auto flex flex-col px-4 sm:px-6 md:px-10 py-6 min-h-[60vh]">
        {/* Halaman Kosong */}
      </div>
    </div>
  );
};
