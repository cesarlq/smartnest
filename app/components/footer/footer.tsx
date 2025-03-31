import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 z-10">
            <div className="max-w-full mx-auto py-3 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} SmartNest Spa. Todos los derechos reservados.
                </p>
            </div>
      </footer>
    );
}
