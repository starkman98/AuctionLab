import { createAuction } from "@/api/auctionApi";
import { ApiError } from "@/types/apiError";
import type { CreateAuctionRequest } from "@/types/auction";
import { getDefaultEndtime } from "@/utils/dateUtils";
import { useState } from "react";
import { useNavigate } from "react-router";

const CreateAuctionPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateAuctionRequest>({
    title: "",
    description: "",
    imageUrl: undefined,
    startingPrice: 0,
    reservationPrice: undefined,
    endTime: getDefaultEndtime(),
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await createAuction(form);

      navigate(`/auctions/${response.auctionId}`);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to create the auction",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 py-12">
      <h1 className="mx auto font-bold text-3xl text-center mb-4">
        Create new auction
      </h1>
      <form
        className="mx-auto max-w-2xl border border-neutral-800 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="flex flex-col mb-3">
          <label>Title</label>
          <input
            className="bg-neutral-200"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            type="text"
            autoComplete="off"
          />
          {fieldErrors.Title?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        <div className="flex flex-col mb-3">
          <label>Description</label>
          <textarea
            className="bg-neutral-200 min-h-12 px-2 py-1"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            autoComplete="off"
          />
          {fieldErrors.Description?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        <div className="flex flex-col mb-3">
          <label>Image URL</label>
          <input
            className="bg-neutral-200"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            type="url"
            autoComplete="off"
          />
          {fieldErrors.ImageUrl?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        <div className="flex flex-col mb-3">
          <label>Starting price</label>
          <input
            className="bg-neutral-200"
            name="startingPrice"
            value={form.startingPrice}
            onChange={handleChange}
            placeholder="Start price"
            type="number"
            autoComplete="off"
          />
          {fieldErrors.StartingPrice?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        <div className="flex flex-col mb-3">
          <label>Reservation price</label>
          <input
            className="bg-neutral-200"
            name="reservationPrice"
            value={form.reservationPrice}
            onChange={handleChange}
            placeholder="Reservation price"
            type="number"
            autoComplete="off"
          />
          {fieldErrors.ReservationPrice?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        <div className="flex flex-col mb-3">
          <label>Endtime</label>
          <input
            className="bg-neutral-200"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            placeholder="Endtime"
            type="datetime-local"
            autoComplete="off"
          />
          {fieldErrors.EndTime?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        {error && <p>{error}</p>}
        <button
          className="px-12 py-2 bg-green-900 text-neutral-50 mt-4"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating auction..." : "Create"}
        </button>
      </form>
    </section>
  );
};

export default CreateAuctionPage;
