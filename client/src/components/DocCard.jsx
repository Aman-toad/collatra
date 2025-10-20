const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
}

const DocCard = ({ doc, onClick, onDelete }) => {
  const sharedCount = doc.members ? doc.members.length - 1 : 0;
  const lastUpdated = timeAgo(doc.updatedAt);

  //prevention
  const handleDeleteClick = (e) => {
    e.stopPropogation();
    onDelete(doc._id, doc.title);
  }
  return (
    <div
      onClick={onClick}
      className="doc-card border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
    >
      <h2 className="text-xl font-semibold mb-2 truncate">
        {doc.title}
      </h2>

      <button
        onClick={handleDeleteClick}
        className="text-red-500 hover:text-red-700 p-1 rounded-full absolute top-2 right-2 z-10"
        title="Delete Document"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.971a2.25 2.25 0 0 1-2.244-2.077L4.76 5.895m14.536 0c.342-.052.682-.107 1.022-.166M8.28 5.895h7.44c1.077 0 1.948.871 1.948 1.948v.111c0 1.077-.871 1.948-1.948 1.948H8.28c-1.077 0-1.948-.871-1.948-1.948V7.843c0-1.077.871-1.948 1.948-1.948Z" />
        </svg>
      </button>
      <div className="text-sm text-gray-500 space-y-1">
        <p>
          Last Updated: {lastUpdated}
        </p>
        <p>
          {/* Only show the count if there are other members */}
          {sharedCount > 0 && (
            <span>
              Shared with {sharedCount} {sharedCount === 1 ? 'person' : 'people'}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DocCard;