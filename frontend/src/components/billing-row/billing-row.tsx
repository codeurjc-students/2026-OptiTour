import './billing-row.css';

export type BillingStatus = 'completado' | 'pendiente' | 'reembolsado';

interface BillingRowProps {
    id: string;
    userName: string;
    concept: string;
    amount: string;
    status: BillingStatus;
}

const statusLabels: Record<BillingStatus, string> = {
    completado: 'Completado',
    pendiente: 'Pendiente',
    reembolsado: 'Reembolsado',
};

function BillingRow({ id, userName, concept, amount, status }: BillingRowProps) {
    return (
        <div className="ot-billing-row">
            <span className="ot-billing-row__id">#{id}</span>
            <span className="ot-billing-row__user">{userName}</span>
            <span className="ot-billing-row__concept">{concept}</span>
            <span className="ot-billing-row__amount">{amount}</span>
            <span className={`ot-billing-row__status ot-billing-row__status--${status}`}>
                {statusLabels[status]}
            </span>
        </div>
    );
}

export default BillingRow;