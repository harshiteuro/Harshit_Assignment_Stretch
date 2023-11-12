import React ,{ useState,useContext,useEffect} from 'react';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useParams ,useNavigate} from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { AuthContext } from '../../shared/context/auth-context';

const DeleteProfile=()=>{
    const auth=useContext(AuthContext);

    const [isLoginMode,setIsLogInMode]=useState(true);

    const {isLoading,error,sendRequest,clearError}=useHttpClient();

    const { id } = useParams();

    const [loadedUsers, setLoadedUsers] = useState();
    useEffect(() => {
        const deleteUser = async () => {
          try {
            const responseData = await sendRequest(
              process.env.REACT_APP_BACKEND_URL+`/users/${id}/delete_profile`
            );
            setLoadedUsers(responseData.user);
          } catch (err) {}
        };
        deleteUser();
        auth.logout()
    },[sendRequest,id]);
    
    
    return (
        <>
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        </>
    );
}

export default DeleteProfile;