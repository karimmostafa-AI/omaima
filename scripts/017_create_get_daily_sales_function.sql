CREATE OR REPLACE FUNCTION get_daily_sales(start_date date, end_date date)
RETURNS TABLE(day date, total numeric) AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('day', created_at)::date AS day,
    sum(total_price) as total
  FROM
    orders
  WHERE
    created_at >= start_date AND created_at < end_date
  GROUP BY
    day
  ORDER BY
    day;
END;
$$ LANGUAGE plpgsql;
