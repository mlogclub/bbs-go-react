import { Tag } from 'antd';
import { TagProps } from 'antd/es/tag';
const DangerTag = (props: TagProps) => {
  return <Tag {...props} color="#f95355"></Tag>;
};

const WarnTag = (props: TagProps) => {
  return <Tag {...props} color="#faad14"></Tag>;
};

const SuccessTag = (props: TagProps) => {
  return <Tag {...props} color="#87d068"></Tag>;
};

export default DangerTag;

export { WarnTag, SuccessTag };
