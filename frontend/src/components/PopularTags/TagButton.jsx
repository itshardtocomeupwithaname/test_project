import { useFeedContext } from "../../context/FeedContext";

const HIGHLIGHTED_TAG_COUNT = 5;

function TagButton({ tagsList }) {
  const { changeTab } = useFeedContext();

  const handleClick = (e) => {
    changeTab(e, "tag");
  };

  return tagsList.slice(0, 50).map((name, index) => (
    <button
      className={`tag-pill tag-default${
        index < HIGHLIGHTED_TAG_COUNT ? " popular-tag-highlight" : ""
      }`}
      key={name}
      onClick={handleClick}
    >
      {name}
    </button>
  ));
}

export default TagButton;
