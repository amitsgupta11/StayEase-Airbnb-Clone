import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../redux/slices/listingSlice.js";
import { PROPERTY_TYPES } from "../../utils/helpers.js";

const CATEGORIES = [
  { label:"All",       icon:"🌍", filter:{} },
  { label:"Beach",     icon:"🏖️", filter:{ city:"beach" } },
  { label:"Mountains", icon:"🏔️", filter:{ city:"mountain" } },
  { label:"Cities",    icon:"🏙️", filter:{ city:"city" } },
  { label:"Villas",    icon:"🏡", filter:{ propertyType:"villa" } },
  { label:"Cabins",    icon:"🛖", filter:{ propertyType:"cabin" } },
  { label:"Resorts",   icon:"🏨", filter:{ propertyType:"resort" } },
  { label:"Luxury",    icon:"✨", filter:{ minPrice:"10000" } },
];

export default function FilterBar({ onFilter }) {
  const dispatch = useDispatch();
  const { filters } = useSelector(s => s.listings);

  const handleCategory = (cat) => {
    dispatch(setFilters(cat.filter));
    onFilter?.(cat.filter);
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 min-w-max">
        {CATEGORIES.map(cat => (
          <button key={cat.label} onClick={() => handleCategory(cat)}
            className="flex flex-col items-center gap-1 pb-2 border-b-2 border-transparent hover:border-primary text-gray-500 hover:text-dark dark:text-gray-400 dark:hover:text-white transition-all px-1 min-w-[56px]">
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
