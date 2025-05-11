import TweetList from "../components/TweetList";
import TweetForm from "../components/TweetForm";

const Feed = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="flex flex-col min-h-screen bg-black text-white items-center py-6 px-4">
      <TweetForm currentUser={user} />
      <div className="mt-6 w-full max-w-2xl">
        <TweetList currentUser={user} />
      </div>
    </div>
  );
};

export default Feed;
