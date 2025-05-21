import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2"; // <-- Import SweetAlert
import { db, storage } from "../firebase";

const TweetForm = ({ currentUser }) => {
  const [tweet, setTweet] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);


  const badWords = [
    "fuck",
    "shit",
    "bitch",
    "ass",
    "niger",
    "gandu",
    "bakwas",
    "lund",
    "pussy",
    "chutiya",
    "madarchod",
    "bhenchod",
    "asshole",
    "lora",
    "luli",
    "lun",
    "bsdk",
    "pp",

  ];

  // Custom message function
  const getUserMessage = (emailOrName) => {
    emailOrName = emailOrName.toLowerCase();
    if (emailOrName.includes("zain")) return "Fuck off niger 🖕";
    if (emailOrName.includes("danial")) return "Shut the fuck up poti man 🖕";
    if (emailOrName.includes("affan")) return "BAKWAS BAND KER KALEEEE 🧑🏿";
    if (emailOrName.includes("badar") || emailOrName.includes("bader"))
      return "Ja phaly bara hoke aa kode 🧝‍♂️";
    if (emailOrName.includes("haider") || emailOrName.includes("hader"))
      return "Ja phaly bara hoke aa kode 🧝‍♂️";
    if (emailOrName.includes("fawad")) return "Bad bull dog 🐶";
    return "Mama khaty ha jo bolta ha wohi hota ha 😒";
  };

  const handlePostTweet = async () => {
    if (!tweet.trim() && !imageFile) return;

    // Check for profanity
    const tweetLower = tweet.toLowerCase();
    const containsBadWords = badWords.some((word) =>
      tweetLower.includes(word)
    );

    if (containsBadWords) {
      const customMessage = getUserMessage(currentUser.email);
      Swal.fire({
        title: "😡 Warning!",
        text: customMessage,
        icon: "error",
        confirmButtonText: "Okay",
        background: "#16181c",
        color: "#fff",
      });
      return;
    }

    setIsUploading(true);

    let imageUrl = null;

    try {
      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });

        const imageRef = ref(
          storage,
          `tweetImages/${Date.now()}_${compressedFile.name}`
        );
        const uploadTask = uploadBytesResumable(imageRef, compressedFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await addDoc(collection(db, "tweets"), {
        text: tweet,
        author: currentUser.email,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
        imageUrl: imageUrl || null,
      });

      setTweet("");
      setImageFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error posting tweet:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#16181c] p-6 rounded-2xl shadow-xl text-white">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Write your post
      </label>
      <textarea
        rows="4"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What’s happening?"
        className="w-full px-4 py-3 bg-transparent border border-[#2f3336] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] placeholder-gray-500 resize-none"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="mt-2 text-sm text-gray-400"
      />

      {isUploading && (
        <p className="text-xs text-gray-400 mt-2">
          Uploading image: {uploadProgress}%
        </p>
      )}

      <button
        onClick={handlePostTweet}
        className="mt-4 w-full bg-[#1d9bf0] py-2 rounded-md hover:bg-[#1a8cd8] transition font-medium disabled:opacity-50"
        disabled={isUploading}
      >
        {isUploading ? "Posting..." : "Post Tweet"}
      </button>
    </div>
  );
};

export default TweetForm;
