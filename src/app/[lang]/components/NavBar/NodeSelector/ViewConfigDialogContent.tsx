import { Fragment, useState } from "react";
import { IconAlertTriangleFilled, IconMoodSmileFilled } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useTranslation } from "@/app/i18n/client";
import { DEFAULT_COIN_NAME, nodeConfigAtom } from "@/app/lib/node-config";
import { isAlgodOK } from "@/app/lib/utils";

type Props = {
  /** Language */
  lng?: string
};

/** Content of the body of the "view node configuration" dialog */
export default function ViewConfigDialogContent({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const [testingNode, setTestingNode] = useState(false);
  const [nodeOK, setNodeOK] = useState<boolean>();
  return (
    <>
      {/*  Max height = height of modal (100vh - 5em)
                        - modal title height if it is 2 lines (2em * 2 lines = 4em)
                        - modal title bottom margin (1.5em)
                        - modal box top padding (1.5em)
                        - modal box bottom padding (1.5em)
                        - action button area (3em)
                        - action button area top margin (1.5em)
      */}
      {/* eslint-disable-next-line max-len */}
      <div className='max-h-[calc(100vh-5em-4em-1.5em-1.5em-1.5em-3em-1.5em)] overflow-auto px-6 sm:px-8 prose-h3:mt-0'>
        <h3>{t('node_selector.view_config.name_heading')}</h3>
        <p>{t(`app:node_selector.${nodeConfig.network}`)}</p>

        <h3>{t('node_selector.view_config.url_heading')}</h3>
        <p>{nodeConfig.nodeServer}</p>

        <h3>{t('node_selector.view_config.port_heading')}</h3>
        <p>{nodeConfig.nodePort ?? <i>{t('none')}</i>}</p>

        <h3>{t('node_selector.view_config.token_heading')}</h3>
        <p>
          {nodeConfig.nodeToken === undefined && <i>{t('none')}</i>}
          {typeof nodeConfig.nodeToken === 'string' && <>
            {nodeConfig.nodeToken === ''
              ? <i>{t('none')}</i>
              : <span className='break-all'>{nodeConfig.nodeToken}</span>
            }
          </>}
        </p>

        <h3>{t('node_selector.view_config.headers_heading')}</h3>
        {nodeConfig.nodeHeaders === undefined && <p><i>{t('none')}</i></p>}
        {/* NOTE: Node headers are expected to be in some sort of key-value map, where the key is
          * the header name and the value is the header value
          */}
        {nodeConfig.nodeHeaders !== undefined && <>
          {Object.keys(nodeConfig.nodeHeaders).length > 0
            ? <dl>
                {Object.keys(nodeConfig.nodeHeaders).map(headerName => (
                  <Fragment key={`header-${headerName}`}>
                    <dt key={`header-${headerName}-name`}>{headerName}</dt>
                    <dd key={`header-${headerName}-value`}>
                      {nodeConfig.nodeHeaders?.[headerName]
                        ? nodeConfig.nodeHeaders[headerName] : <i>{t('empty')}</i>
                      }
                    </dd>
                  </Fragment>
                ))}
              </dl>
            : <p><i>{t('none')}</i></p>
          }
        </>}

        <h3>{t('node_selector.view_config.coin_name_heading')}</h3>
        <p>{nodeConfig.coinName ?? DEFAULT_COIN_NAME}</p>
      </div>
      <div className='modal-action px-6 sm:px-8 grid grid-cols-3 gap-2'>
        <button type='button' className='btn btn-block col-span-1 btn-primary'
          onClick={async (e) => {
            e.preventDefault();
            setTestingNode(true);
            setNodeOK(undefined); // Clear test status while testing
            setNodeOK(await isAlgodOK(
              nodeConfig.nodeToken ?? '',
              nodeConfig.nodeServer,
              nodeConfig.nodePort,
              nodeConfig.nodeHeaders
            ));
            setTestingNode(false);
          }}
        >
          {testingNode && <span className='loading loading-spinner' />}
          {!testingNode && t('node_selector.view_config.test_btn')}
        </button>
        <div className='text-sm flex col-span-2 items-center m-0'>
          {nodeOK && <>
            <IconMoodSmileFilled aria-hidden size={20} className='me-2 text-success' />
            {t('node_selector.view_config.test_pass')}
          </>}
          {nodeOK === false && <>
            <IconAlertTriangleFilled aria-hidden size={20} className='me-2 text-warning' />
            {t('node_selector.view_config.test_fail')}
          </>}
        </div>
      </div>
    </>
  );
}
