const Spinner = ({
  sizeClass = "w-4 h-4",
  thickClass = "border-2",
}: {
  sizeClass?: string;
  thickClass?: string;
}) => (
  <span
    className={`inline-block ${sizeClass} ${thickClass} rounded-full border-black border-t-transparent animate-spin`}
  />
);

export default Spinner;
