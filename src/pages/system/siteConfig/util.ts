import { useEffect, useState } from 'react';
import { message } from 'antd';
import { FormInstance } from 'antd/es/form';
import { getTagsByIds, TagLiteItem } from '@/services/tag';
import { getAllConfig, saveConfig, ConfigItem } from '@/services/siteConfig';
import { getOkNodes, NodeItem } from '@/services/topicNode';
import { SysConfigRecommendTags } from '@/utils/constant';

// 通用获取数据
export const getAllConfigData = () => {
  return new Promise<ConfigItem>((reslove, reject) => {
    getAllConfig<ConfigItem>().then(res => {
      const { success, data, message: msg } = res.data;
      if (success) {
        reslove(data);
      } else {
        message.error({ content: msg });
        reject(res.data);
      }
    });
  });
};

// config hooks
export const UserConfig = (
  form?: FormInstance,
  update?: boolean,
  cb?: (data: ConfigItem) => void,
): [
  { config?: ConfigItem; node?: NodeItem; tags?: TagLiteItem[] },
  (data: any, succ?: () => void, fail?: () => void) => void,
  boolean,
] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [configData, setConfigData] = useState<ConfigItem>();
  const [tags, setTags] = useState<TagLiteItem[]>();

  const save = (data, succ, fail) => {
    const postData = Object.assign(configData, data);
    try {
      saveConfig({
        config: JSON.stringify(postData),
      }).then(res => {
        const { success, message: msg } = res.data;
        if (success) {
          message.success({ content: '保存成功' });
          if (update) {
            getData();
          }
          succ?.();
        } else {
          message.error({ content: msg });
          fail?.();
        }
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const getData = () => {
    setLoading(true);
    getAllConfigData()
      .then(res => {
        setConfigData(res);
        form && form.setFieldsValue(res);
        getRecommendTags(res[SysConfigRecommendTags]);
      })
      .finally(() => setLoading(false));
  };

  const getRecommendTags = ids => {
    getTagsByIds('tagIds=' + ids.join('&tagIds=')).then(res => {
      const { success, data } = res.data;
      if (success) {
        setTags(data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return [{ config: configData, tags: tags }, save, loading];
};

// 获取node接地那
export const UseNodes = (): [NodeItem[] | undefined] => {
  const [nodeList, setNodeList] = useState<NodeItem[]>();
  useEffect(() => {
    getOkNodes().then(res => {
      const { success, data } = res.data;
      if (success) {
        setNodeList(data);
      }
    });
  }, []);
  return [nodeList];
};

export const handleSubmit = () => {};
