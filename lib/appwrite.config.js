import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

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