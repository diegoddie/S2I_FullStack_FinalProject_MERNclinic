import { format } from 'date-fns';
import it from 'date-fns/locale/it/index.js';

const formatDate = (dateString, typology) => {
    const date = new Date(dateString);
      
    if (typology === 'vacation') {
        return format(date, 'dd/MM/yyyy', { locale: it });
    } else {
        const formattedDate = format(date, 'dd/MM/yyyy', { locale: it });
        const formattedTime = format(date, 'HH:mm', { locale: it });
        return `${formattedDate} ${formattedTime}`;
    }
};

export default formatDate;
