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
    <section className="app-page-narrow">
      <p className="app-kicker">New lot</p>
      <h1 className="app-title mb-8">Create Auction</h1>
      <form
        className="app-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="app-field">
          <label className="app-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="app-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            type="text"
            autoComplete="off"
          />
          {fieldErrors.Title?.map((msg) => (
            <p key={msg} className="app-error">
              {msg}
            </p>
          ))}
        </div>
        <div className="app-field">
          <label className="app-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="app-textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            autoComplete="off"
          />
          {fieldErrors.Description?.map((msg) => (
            <p key={msg} className="app-error">
              {msg}
            </p>
          ))}
        </div>
        <div className="app-field">
          <label className="app-label" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            className="app-input"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            type="url"
            autoComplete="off"
          />
          {fieldErrors.ImageUrl?.map((msg) => (
            <p key={msg} className="app-error">
              {msg}
            </p>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="app-field">
            <label className="app-label" htmlFor="startingPrice">
              Starting price
            </label>
            <input
              id="startingPrice"
              className="app-input"
              name="startingPrice"
              value={form.startingPrice}
              onChange={handleChange}
              placeholder="Start price"
              type="number"
              autoComplete="off"
            />
            {fieldErrors.StartingPrice?.map((msg) => (
              <p key={msg} className="app-error">
                {msg}
              </p>
            ))}
          </div>
          <div className="app-field">
            <label className="app-label" htmlFor="reservationPrice">
              Reservation price
            </label>
            <input
              id="reservationPrice"
              className="app-input"
              name="reservationPrice"
              value={form.reservationPrice}
              onChange={handleChange}
              placeholder="Reservation price"
              type="number"
              autoComplete="off"
            />
            {fieldErrors.ReservationPrice?.map((msg) => (
              <p key={msg} className="app-error">
                {msg}
              </p>
            ))}
          </div>
        </div>
        <div className="app-field">
          <label className="app-label" htmlFor="endTime">
            Endtime
          </label>
          <input
            id="endTime"
            className="app-input"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            placeholder="Endtime"
            type="datetime-local"
            autoComplete="off"
          />
          {fieldErrors.EndTime?.map((msg) => (
            <p key={msg} className="app-error">
              {msg}
            </p>
          ))}
        </div>
        {error && <p className="app-error">{error}</p>}
        <button
          className="app-button app-button-primary w-full"
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
