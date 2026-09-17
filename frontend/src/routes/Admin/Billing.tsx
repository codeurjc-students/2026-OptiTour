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

const billingRecords: BillingRecord[] = [
    { id: '0001', userName: '<<Nombre usuario>>', concept: '<<Concepto>>', amount: '24,00 €', status: 'completado' },
    { id: '0002', userName: '<<Nombre usuario>>', concept: '<<Concepto>>', amount: '18,50 €', status: 'pendiente' },
];

function Billing() {
    return (
        <div>
            <h1 className="ot-panel-title">Facturación</h1>

            <Row className="g-3 mb-3">
                <Col md={6}>
                    <StatCard value="1,5 M €" label="Total histórico" />
                </Col>
                <Col md={6}>
                    <StatCard value="2,5 K €" label="Total este mes" />
                </Col>
            </Row>

            <div className="mb-4">
                <ChartPlaceholder type="line" label="Gráfico lineal de ingresos" />
            </div>

            <div className="ot-billing-list">
                {billingRecords.map((record) => (
                    <BillingRow key={record.id} {...record} />
                ))}
            </div>
        </div>
    );
}

export default Billing;