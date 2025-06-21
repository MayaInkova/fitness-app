import { Link } from "react-router-dom"; // Импортираме Link

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white text-lg mb-3 font-heading">FitnessApp</h4>
          <p className="text-sm leading-relaxed">
            Персонализирани режими, интелигентен чатбот и всичко, от което се нуждаеш, за да достигнеш
            своя фитнес връх.
          </p>
        </div>
        <div>
          <h4 className="text-white text-lg mb-3 font-heading">Меню</h4>
          <ul className="space-y-2 text-sm">
            {/* Променени <a> тагове на <Link> тагове за клиентска маршрутизация */}
            <li><Link to="/dashboard" className="hover:text-white">Табло</Link></li>
            <li><Link to="/plan" className="hover:text-white">Моят режим</Link></li>
            <li><Link to="/history" className="hover:text-white">История</Link></li>
            <li><Link to="/chatbot" className="hover:text-white">Чатбот</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-lg mb-3 font-heading">Контакти</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 София, България</li>
            <li>📞 +359 888 123 456</li>
            <li>✉️ support@fitnessapp.bg</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs mt-8">© 2025 FitnessApp. All Rights Reserved.</p>
    </footer>
  );
}
