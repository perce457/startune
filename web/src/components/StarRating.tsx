interface StarRatingProps {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function StarRating({
  value,
  disabled = false,
  onChange,
}: StarRatingProps) {
  return (
    <div
      className="star-rating"
      role="radiogroup"
      aria-label="Kappaleen arvio"
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={rating <= value ? "star active" : "star"}
          aria-label={`${rating} tähteä`}
          aria-checked={rating === value}
          disabled={disabled}
          role="radio"
          onClick={() => onChange(rating)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
