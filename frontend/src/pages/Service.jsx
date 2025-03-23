import ServiceDetails from '../components/ServiceDetails'
import Appoinment from '../components/Appoinment'
import BookingAppoinment from '../components/BookingAppoinment'
import React, { useState } from 'react';

const Service = () => {

    const [isBookable, setIsBookable] = useState(false);

    return (
        <div>
            <ServiceDetails setIsBookable={setIsBookable} />
            {isBookable ? <BookingAppoinment /> : <Appoinment />}
        </div>
    )
}

export default Service