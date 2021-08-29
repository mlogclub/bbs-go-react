import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
const GreenButton = (props: ButtonProps) => {
  let { type, ...rest } = props;
  if (type === 'primary') {
    type = 'default';
  }
  return <Button type={type} {...rest} className="btn-green"></Button>;
};

export default GreenButton;
