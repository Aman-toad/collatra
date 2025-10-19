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

const DocCard = ({ doc, onClick }) => {
  const sharedCount = doc.members ? doc.members.length - 1 : 0;

  const lastUpdated = timeAgo(doc.updatedAt);
  return (
    <div
      onClick={onClick}
      className="doc-card border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
    >
      <h2 className="text-xl font-semibold mb-2 truncate">
        {doc.title}
      </h2>
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