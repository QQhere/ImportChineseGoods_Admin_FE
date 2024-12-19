import { Breadcrumb, Button, DatePicker, Divider, Flex, Form, Input, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { consignmentApi } from '@api/consignmentApi';
import ConsignmentsList from '@components/components/consignments';
const { RangePicker } = DatePicker;

function Consignments() {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({
      status: 'all',
      dateRange: [dayjs().add(-30, 'd'), dayjs()],
      search: '',
    });
  const [query, setQuery] = useState({});

    const options = [
      {
        label: 'Shop gửi hàng',
        value: 'shop_shipping',
      },
      {
        label: 'Kho Trung Quốc nhận',
        value: 'china_warehouse_received',
      },
      {
        label: 'Kho Việt Nam nhận',
        value: 'vietnam_warehouse_received',
      },
      {
        label: 'Chờ xuất kho',
        value: 'waiting_export',
      },
      {
        label: 'Đã xuất kho',
        value: 'exported',
      },
      {
        label: 'Đã hủy',
        value: 'cancelled',
      },
      {
        label: 'Tất cả trạng thái',
        value: 'all',
      },
    ];
    const rangePresets = [
      {
        label: 'Last 7 Days',
        value: [dayjs().add(-7, 'd'), dayjs()],
      },
      {
        label: 'Last 14 Days',
        value: [dayjs().add(-14, 'd'), dayjs()],
      },
      {
        label: 'Last 30 Days',
        value: [dayjs().add(-30, 'd'), dayjs()],
      },
      {
        label: 'Last 90 Days',
        value: [dayjs().add(-90, 'd'), dayjs()],
      },
    ];
    const handleFilter = (values) => {
      setQuery({
        status: values.status,
        dateRange: [ values.dateRange[0].format('YYYY-MM-DD 00:00:00'), values.dateRange[1].format('YYYY-MM-DD 23:59:59') ],
        search: values.search,
      });
      setPage(1);
    };
  const fetchConsignments = async () => {
    setLoading(true);
    const response = await consignmentApi.queryConsignment(query, page, pageSize);
    if (response.status === 200) {
      setConsignments(response.consignments.rows);
      setTotal(response.consignments.count);
    } else {
      notification.error({
        message: 'Lỗi khi lấy dữ liệu',
        description: response?.RM || 'Vui lòng thử lại.',
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchConsignments();
  }, [page, pageSize, query]);

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const startResult = (page - 1) * pageSize + 1;
  const endResult = Math.min(page * pageSize, total);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Trang chủ</Link>,
          },
          {
            title: 'Đơn ký gửi',
          },
        ]}
      />
      <Divider />
      <Form
        layout="inline"
        onFinish={handleFilter}
        style={{ marginBottom: '16px' }}
        initialValues={filter}
      >
        <Form.Item label="Trạng thái" name="status">
          <Select
            options={options}
            style={{
              width: '200px',
            }}
          />
        </Form.Item>
        <Form.Item label="Thời gian" name="dateRange">
          <RangePicker
            allowClear={false}
            presets={rangePresets} />
        </Form.Item>
        <Form.Item label="Từ khóa" name="search">
          <Input placeholder="Nhập từ khóa" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lọc
          </Button>
        </Form.Item>
      </Form>
      <Flex justify='space-between' align='center' style={{ margin: '10px' }}>
        <p>Hiển thị từ {startResult} đến {endResult} trong tổng {total} kết quả</p>

        <div>
          Hiển thị:
          <Select
            defaultValue="50"
            style={{ width: 120 }}
            onChange={(value) => {
              setPageSize(value);
            }}
            options={[
              { value: '10', label: '10 / page' },
              { value: '20', label: '20 / page' },
              { value: '50', label: '50 / page' },
              { value: '100', label: '100 / page' },
            ]}
          />
        </div>
      </Flex>
      <ConsignmentsList
        data={consignments}
        total={total}  // Truyền tổng số lượng phần tử
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange} // Truyền hàm thay đổi trang
      />
    </div>
  );
}

export default Consignments;
