import * as React from 'react';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';

type ReportRow = {
  id: number;
  tipo_reporte: string;
  asunto: string | null;
  asunto_conversacion: string | null;
  estado: string;
  creado_en: string;
  nombre_usuario: string;
  dias_para_vencer: number;
};

export function UpcomingReportsEmail(props: { daysBefore: number; reports: ReportRow[] }) {
  const { daysBefore, reports } = props;
  return (
    <Html>
      <Section style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Heading as="h2">Reportes próximos a vencer (≤ {daysBefore} días)</Heading>
        <Text>Resumen automático generado por HSEQ.</Text>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Tipo</th>
              <th style={th}>Título</th>
              <th style={th}>Usuario</th>
              <th style={th}>Vence en</th>
              <th style={th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td style={td}>#{r.id}</td>
                <td style={td}>{r.tipo_reporte}</td>
                <td style={td}>{r.asunto || r.asunto_conversacion || '(sin asunto)'}</td>
                <td style={td}>{r.nombre_usuario}</td>
                <td style={td}>{r.dias_para_vencer} días</td>
                <td style={td}>{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <Text style={{ color: '#666' }}>Este es un mensaje automático. No responder.</Text>
      </Section>
    </Html>
  );
}

const th: React.CSSProperties = {
  padding: 8,
  border: '1px solid #eee',
  textAlign: 'left',
};

const td: React.CSSProperties = {
  padding: 8,
  border: '1px solid #eee',
};

export default UpcomingReportsEmail;


