
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
  } from "reactstrap";
  
  import {getFromStorage} from '../../utils/Storage'
  import axios from '../../utils/axios'
  import React, {useState, useEffect} from 'react'
  import moment from "moment";
  
  const BookingList = ({bookingList}) => {

    const user = getFromStorage('userToken');
    const parsUser = JSON.parse(user);

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
      

      const handlePageClick = (e, index) => {
        e.preventDefault();
        setCurrentPage(index);
        console.log('this is index ', index)
     };

    return (
      <>
        <Container className="mt--0" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0" style={{color: 'black'}}>My Bookings</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th style={{color: '#ff9933'}} scope="col">#</th>
                      <th style={{color: '#ff9933'}} scope="col">{parsUser.is_therapist ? 'Patient' : 'Provider'}</th>
                      <th style={{color: '#ff9933'}} scope="col">Service Category</th>
                      <th style={{color: '#ff9933'}} scope="col">Date</th>
                      <th style={{color: '#ff9933'}} scope="col">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                  {bookingList.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((ele, index)=>{
                    return(
                        <tr key={index}>
                            <th style={{color: '#ff9933'}}>{index}</th>
                            <th>{parsUser.is_therapist ? ele.booker : ele.therapist}</th>
                            <th>{ele.therapist_category}</th>
                            <th>{moment(ele.start_date).format('dddd [the] Do [of] MMMM')}</th>
                            <th>{ele.start_time}</th>
                        </tr>
                    )
                  })}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      {bookingList.slice(0, Math.ceil(bookingList.length/10)).map((page, i) => (
                        <PaginationItem active={i === currentPage} key={i}>
                        <PaginationLink onClick={e => handlePageClick(e, i)} href="#">
                            {i + 1}
                        </PaginationLink>
                        </PaginationItem>
                        ))}
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
          {/* Dark table */}
                </Container>
      </>
    );
  };
  
  export default BookingList;
  