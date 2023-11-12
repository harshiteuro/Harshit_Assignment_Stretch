import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/auth-hook';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

import Button from '../../shared/components/FormElements/Button';

const UserItem = props => {
  const {token,login,logout,userId} =useAuth();
  return (
    <>
    <li className="user-item" >
      <Card className="user-item__content">
        <Link to={`/${props.id}/view_profile`} style={{ height: props.viewAllDetails ? '400px' : ''}}>
        {userId===props.id && <div className='online_user'>online</div>}
          <div className="user-item__image">
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>name: {props.name}</h2>
            <h3>
              <span>bio:</span>{props.bio}
            </h3>
            <h3>
              <span>tech stacks :</span>{props.techstack}
            </h3>
            <h3>
              <span>seeking:</span> {props.seeking}
            </h3>
            {props.viewAllDetails && <h3>
              <span>github:</span> {props.github}
            </h3>
            }
            {props.viewAllDetails && 
            <h3>
              <span>website:</span> {props.website}
            </h3>}
            {props.viewAllDetails && 
            <h3>
              <span>email:</span> {props.email}
            </h3>}
            {props.viewAllDetails &&
            <h3>
              <span>field of interest:</span>{props.fieldofinterest}
            </h3>}
          </div>
        </Link>
      </Card>
    </li>
    {userId===props.id &&  props.viewAllDetails && <Button type='button' to={`/${props.id}/edit_profile`}>Edit profile</Button>}
    {userId===props.id && props.viewAllDetails && <Button type='button' to={`/${props.id}/delete_profile`}>Delete profile</Button>}
    </>
  );
};

export default UserItem;
