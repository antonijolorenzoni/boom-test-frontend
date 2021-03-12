import React, { useState } from 'react';

import { TableWrapper } from './styles';
import Spinner from '../Spinner/Spinner';
import { OrderStatus } from 'types/OrderStatus';

interface Props {
  tableInstance: any;
  isLoading: boolean;
  onSelectRow: (order: { orderId: number; companyId: number; score?: number }) => void;
}

export const AllOrdersTable: React.FC<Props> = ({ tableInstance, isLoading, onSelectRow }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow }: any = tableInstance;

  const [tableWrapperNode, setTableWrapperNode] = useState<HTMLDivElement | null>();

  return (
    <TableWrapper>
      <div
        style={{ overflowY: 'scroll', height: `calc(100vh - ${tableWrapperNode?.getBoundingClientRect().y}px)` }}
        ref={setTableWrapperNode}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps()} style={{ width: column.width }}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: any) => {
              prepareRow(row);

              const rowLength = row.cells.length;

              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => onSelectRow(row.original)}
                  data-testid={`order-${row.original.orderId}`}
                  style={{
                    opacity: [OrderStatus.Reshoot, OrderStatus.Canceled].includes(row.original.orderStatus) ? 0.4 : 1,
                  }}
                >
                  {row.cells.map((cell: any, i: number) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: cell.column.id !== 'assignee' ? 10 : '0 10px',
                          maxWidth: 0,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          boxShadow: i === rowLength - 1 ? 'none' : '6px 0px 0px -5px rgba(162,171,177,.8)',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && (
          <Spinner
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
          />
        )}
      </div>
    </TableWrapper>
  );
};
