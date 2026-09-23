import './payment-list-item.css';

export type PaymentStatus = 'completado' | 'pendiente' | 'reembolsado';

interface PaymentListItemProps {
    concept: string;
    date: string;
    amount: string;
    status: PaymentStatus;
}

const statusLabels: Record<PaymentStatus,
    string> = {
    completado: 'Completado',
    pendiente: 'Pendiente',
    reembolsado: 'Reembolsado',
}

    ;

/** Fila de un pago dentro del historial de "Mis pagos". */
function PaymentListItem({
    concept, date, amount, status
}

    : PaymentListItemProps) {
    return (<div className="ot-payment-item" > <div className="ot-payment-item__icon" > <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" > <path d="M7 3h10a1 1 0 0 1 1 1v16l-2.5-1.5L13 20l-2.5-1.5L8 20l-2.5-1.5L3 20V4a1 1 0 0 1 1-1h3Z" /> <path d="M8 8h8M8 12h8M8 16h4" /> </svg> </div> <div className="ot-payment-item__info" > <span className="ot-payment-item__concept" > {
        concept
    }

    </span> <span className="ot-payment-item__date" > {
        date
    }

        </span> </div> <div className="ot-payment-item__amount-col" > <span className="ot-payment-item__amount" > {
            amount
        }

        </span> <span className={
            `ot-payment-item__status ot-payment-item__status--$ {
                status
            }

            `
        }

        > {
                    statusLabels[status]
                }

            </span> </div> </div>);
}

export default PaymentListItem;