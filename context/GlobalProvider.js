import { createContext, useContext, useEffect, useState } from "react";
import {  getCurrUser, getUserBookmarks } from "../lib/appwrite.config";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch current user on mount
    useEffect(() => {
        getCurrUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Function to refresh bookmarks
    const refreshBookmarks = () => {
        if (user) {
            setIsLoading(true);
            getUserBookmarks(user?.$id)
                .then((res) => {
                    setBookmarks(res || []);
                })
                .catch((error) => {
                    console.log(error);
                    setBookmarks([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    // Fetch bookmarks when user changes
    useEffect(() => {
        refreshBookmarks();
        // refreshPosts();
    }, []);
    

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                bookmarks,
                deleting,
                setDeleting,
                uploading,
                setUploading,
                isLoading,
                refreshBookmarks, // Expose bookmark refresh function
                // refreshPosts, // Expose posts refresh function
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};