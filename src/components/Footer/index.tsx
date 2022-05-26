import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      // copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '管理系统',
          title: '管理系统',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
