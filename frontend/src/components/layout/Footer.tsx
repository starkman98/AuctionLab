const Footer = () => {
  return (
    <footer className="border-t border-black bg-white px-4 py-5">
      <div className="mx-auto max-w-5xl text-center text-sm font-bold uppercase text-neutral-900">
        <p>(c) {new Date().getFullYear()} Anton Stark</p>
      </div>
    </footer>
  );
};

export default Footer;
