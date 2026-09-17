import { Row, Col } from 'react-bootstrap';
import StatCard from '../../components/StatCard/StatCard';
import ChartPlaceholder from '../../components/ChartPlaceholder/ChartPlaceholder';
import BillingRow from '../../components/BillingRow/BillingRow';

interface BillingRecord {
    id: string;
    userName: string;
    concept: string;
    amount: string;
    status: 'completado' | 'pendiente' | 'reembolsado';
}

const payments: BillingRecord[] = [
    { id: '0001', userName: '', concept: '<<Nombre de tour 1>>', amount: '24,00 €', status: 'completado' },
    { id: '0002', userName: '', concept: '<<Nombre de tour 2>>', amount: '18,50 €', status: 'completado' },
    { id: '0003', userName: '', concept: '<<Nombre de tour 3>>', amount: '32,00 €', status: 'pendiente' },
    { id: '0004', userName: '', concept: '<<Nombre de tour 4>>', amount: '20,00 €', status: 'reembolsado' },
];

function MyPaymentsPage() {
    return (
        <div>
            <h1 className="ot-panel-title">Mis pagos</h1>

            <Row className="g-3 mb-3">
                <Col md={6}>
                    <StatCard value="95,00 €" label="Total gastado" />
                </Col>
                <Col md={6}>
                    <StatCard value="1" label="Pendientes" />
                </Col>
            </Row>

            <div className="mb-4">
                <ChartPlaceholder type="line" label="Historial de pagos" />
            </div>

            <div className="ot-billing-list">
                {payments.map((payment) => (
                    <BillingRow key={payment.id} {...payment} />
                ))}
            </div>
        </div>
    );
}

export default MyPaymentsPage;