import React from 'react';
import { Switch } from 'antd';
import { useModel } from 'umi';

function ThemeChange() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser, settings } = initialState!;
  const changeTheme = (val: boolean) => {
    console.log(val)
    setInitialState({ settings: { ...settings, navTheme: val ? "realDark" : "light" }, currentUser: { ...currentUser } });
  }
  return (
    <div>
      <Switch
        checkedChildren="🌛"
        unCheckedChildren="🌞"
        size="small"
        defaultChecked={false}
        onChange={changeTheme} />
    </div>
  );
}

export default ThemeChange;
