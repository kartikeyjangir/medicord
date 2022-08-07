import React, { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";

import { InviteIcon } from "../assets";

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);
  const handleSelect = () => {
    // we could have used this one, but here we will have multiple users to be selected
    // setSelected((prev) => !prev);
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }

    setSelected((prevSelected) => !prevSelected);
  };
  return (
    <div className="user-item__wrapper" onClick={handleSelect}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className="user-item__name">{user.fullName || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

export default function UserList({ setSelectedUsers }) {
  //useChatContext() returns an object with the following properties:
  //client: the StreamChat client
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  //if no user exist, it will be used as flag
  const [isListEmpty, setIsListEmpty] = useState(false);
  //For error handling
  const [error, setError] = useState(false);

  useEffect(() => {
    // function to get the user
    const getUsers = async () => {
      // if currently something is loading then return this function
      if (loading) return;
      // Now as we are going to fetch the users data so we will set the loading to true
      setLoading(true);

      // fetch the users data
      try {
        //client.queryUsers() will fetch all the users but
        // i). we dont need our self in the list =>  {id:{$ne:client.userID}},
        // ii). sort them => {id:1}
        // iii). limit the number of users to 10
        const response = await client.queryUsers(
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 10 }
        );

        if (response.users.length) {
          setUsers(response.users);
          console.log(users);
        } else {
          setIsListEmpty(true);
        }
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };
    getUsers();
  }, []);

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again.
        </div>
      </ListContainer>
    );
  }

  if (isListEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message">Loading users...</div>
      ) : (
        users?.map((user, i) => (
          <UserItem
            index={i}
            key={user.id}
            user={user}
            setSelectedUsers={setSelectedUsers}
          />
        ))
      )}
    </ListContainer>
  );
}
