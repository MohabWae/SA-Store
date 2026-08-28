function FilterBar({ category, setCategory }) {
  const categories = [
    "All",
    "Creatine",
    "Protein",
    "Carbs",
    "Pre-Workout",
  ];

  return (
    <div className="filter-wrapper">
      {categories.map((item) => (
        <button
          key={item}
          type="button"
          className={category === item ? "filter-btn active" : "filter-btn"}
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;