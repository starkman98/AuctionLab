const Spinner = ({
  sizeClass = "w-4 h-4",
  thickClass = "border-2",
}: {
  sizeClass?: string;
  thickClass?: string;
}) => (
  <span
    className={`inline-block ${sizeClass} ${thickClass} border-t-transparent rounded-full animate-spin`}
  />
);

export default Spinner;
