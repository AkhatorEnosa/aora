import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.gosabinc.aora",
  projectId: "678f55ac0020e20ff4b9",
  storageId: "678f5c5a00284e351a3c",
  databaseId: "678f59dd00384aa17a34",
  userCollectionId: "678f59fd0034452ad792",
  videoCollectionId: "678f5a3c002582e884f6",
};

const {
  endpoint,
  platform,
  projectId,
  storageId,
  databaseId,
  userCollectionId,
  videoCollectionId,
} = appwriteConfig

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)


let fileIds = []; //To capture uploaded files IDs

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount =  await account.create(
        ID.unique(), 
        email, 
        password, 
        username
        );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    //add user to database
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountID: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

//Sign In
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error)
    }
}

// Get current user 
export const getCurrUser = async () => {
    try {
        // get account from session 
      const currentAccount = await account.get();

      if(!currentAccount) throw Error;

      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountID', currentAccount.$id)]
      )

      if(!currentUser) throw Error;

      return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )
      return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    )
      return posts.documents;
  } catch (error) {
    throw new Error(error)
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts for users
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('$createdAt', Query.limit(7))]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign User Out 
export const signOut = async() => {
  try {
    const session = await account.deleteSession("current")

    return session;
  } catch (error) {
    throw new Error(error)
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadFile = async (file, type) => {
  if(!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest }

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    )

    // console.log("upload file", uploadedFile)

    fileIds = [...fileIds, uploadedFile.$id]

    // console.log("uploaded files ids", fileIds)

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error)
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
        fileIds: fileIds
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts for users
export const getUserBookmarks = async(userId) => {
// console.log(userId)
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [
        Query.equal("creator", userId), 
        Query.contains("bookmarkedBy", userId),
        Query.orderDesc("$createdAt")
      ]
    );

    if (!posts) throw new Error("Something went wrong");

    console.log(posts.documents.bookmarkedBy)

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Toggle bookmark 
export const toggleBookmark = async(postId, userId) => {
  // console.log(postId)
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId
    );

    if (!post) throw new Error("Something went wrong");

    const findUserId = post.bookmarkedBy.find((x) => x == userId)

    if(findUserId) {
      console.log(post)

      const filterArr = post.bookmarkedBy.filter((x) => x !== userId)

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        postId,
        {
          bookmarkedBy: [...filterArr]
        }
      );
    } else {
      console.log("Clean Slate")

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        postId,
        {
          bookmarkedBy: [...post.bookmarkedBy, userId]
        }
      );
    }

    return post.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const deletePost = async(postId, postFilesIds) => {
  try {

    // console.log("deleted", result)
    if(postFilesIds.length > 0) {
      const result = await databases.deleteDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.videoCollectionId, // collectionId
        postId // documentId
      );

      if(!result) throw new Error("Something went wrong")

      // if result go ahead and delete files related to deleted document 
      postFilesIds.map(async(fileId) => {
        await storage.deleteFile(
            appwriteConfig.storageId, // bucketId
            fileId // fileId
        );
      })
      
      console.log(postFilesIds)
    } else {
      console.log("No file associated with post")
    }


  } catch (error) {
    throw new Error(error)
  }
}