import { format } from 'date-fns';
import it from 'date-fns/locale/it/index.js';

const formatDate = (dateString, typology) => {
    console.log(dateString)
    const date = new Date(dateString);
    console.log(date)
    if (typology === 'vacation') {
        return format(date, 'dd/MM/yyyy', { locale: it });
    } else {
        const formattedDate = format(date, 'dd/MM/yyyy', { locale: it });
        const formattedTime = format(date, 'HH:mm', { locale: it });
        console.log(formattedTime)
        return `${formattedDate} ${formattedTime}`;
    }
};

export default formatDate;
