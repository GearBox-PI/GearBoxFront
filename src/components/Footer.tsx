export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 mt-6">
      <div className="mx-auto max-w-5xl px-4 py-4 text-center text-sm text-gray-500 flex flex-col gap-2">
        <p>© 2025 Gear Box — Todos os direitos reservados.</p>
        <a
          href="https://github.com/GearBox-PI"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
        >
          GitHub da Organização
        </a>
      </div>
    </footer>
  );
}
