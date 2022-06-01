import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Resort(props) {
  const { resort } = props;
  const {user} = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === resort._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/resorts/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Resort is not Available');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <Card className='Card' style={{width:"262px" ,height:"390px" }}>
      <Link to={`/resort/${resort.slug}`}>
        <img style={{width:"260px" ,height:"200px"}} src={resort.image} className="card-img-top" alt={resort.name} />
      </Link>
      <Card.Body>
        <Link to={`/resort/${resort.slug}`}>
          <Card.Title>{resort.name}</Card.Title>
        </Link>
        <Rating rating={resort.rating} numReviews={resort.numReviews} />
        <Card.Text>Rs.{resort.price} /head</Card.Text>

       {user.isResort?(<p>dsds</p>):( resort.countInStock === 0 ? (
          <Button variant="dark" disabled>
            Not Available
          </Button>
        ) : (
          <Button variant="dark" onClick={() => addToCartHandler(resort)}>whishlist</Button>
        ))}
      </Card.Body>
    </Card>
  );
}
export default Resort;
