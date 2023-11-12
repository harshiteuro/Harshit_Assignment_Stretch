import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './ViewProfile.css'

import UsersList from '../components/UsersList';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Modal from '../../shared/components/UIElements/Modal';

const ViewProfile = () => {
    const { id } = useParams();
    
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const responseData = await sendRequest(
              process.env.REACT_APP_BACKEND_URL+`/users/${id}/view_profile`
            );
            
            setLoadedUsers(responseData.user);
          } catch (err) {}
        };
        fetchUsers();
    },[sendRequest,id]);

    //fetch all result and show
    return <>
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <div id='view-profile'><UsersList viewAllDetails={true} items={loadedUsers} /></div>}
    </React.Fragment>
    </>
};

export default ViewProfile;
