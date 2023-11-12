import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Users.css';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [startSearching, setStartSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          const formData=new FormData();
          formData.append('sort',sortBy);
          formData.append('search',searchTerm);
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL+'/users',
            'POST',
            formData
          );
          setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
    // setSearchTerm('');
    setStartSearching(false);
  }, [sendRequest,startSearching,sortBy]);

  function changeHandler(event){
    event.preventDefault(); 
    setSearchTerm(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault(); 

    const selectedCategory = event.target.querySelector('#searchCategory').value;
    setSortBy(selectedCategory);
    setStartSearching(true);
  }


  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      <form onSubmit={handleSubmit} className="search-container">
        <select class="category-dropdown" id="searchCategory">
              <option value="name">name</option>
              <option value="techstack">techstack</option>
              <option value="bio">bio</option>
        </select>
        <input type="text" className="search-input" id="searchInput" value={searchTerm} placeholder="Enter your search term" onChange={changeHandler}></input>
        <button type="submit" className="search-button">Search</button>
      </form>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
