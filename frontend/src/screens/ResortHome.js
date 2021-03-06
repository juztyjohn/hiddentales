import { useContext,useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Resort from '../components/Resort';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, resorts: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ResortHome() {
  const [{ loading, error, resorts   }, dispatch] = useReducer(logger(reducer), {
    resorts: [],
    loading: true,
    error: '',
  
  });
  const { state } = useContext(Store);

  const {userInfo} = state;

  // const [resorts, setresorts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/resorts');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setresorts(result.data);
    };
    fetchData();
  }, []);
  console.log(userInfo)
  return (
    <div>
      <Helmet>
        <title>Hidden Tales</title>
      </Helmet>
      <h1>Featured Resorts</h1>
      <div>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {resorts.map((resort) => {
              if(userInfo.isResort&& (resort.email===userInfo.email)){
                return(
                  <Col key={resort.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Resort resort={resort} user={userInfo}></Resort>
                </Col>)
                
              }
              else if(!userInfo.isResort){
                return(
                  <Col key={resort.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Resort resort={resort} user={userInfo}></Resort>
                </Col>)
              }
             
              
            })}
          </Row>
        )}
      </div>
    </div>
  );
}
export default ResortHome;
