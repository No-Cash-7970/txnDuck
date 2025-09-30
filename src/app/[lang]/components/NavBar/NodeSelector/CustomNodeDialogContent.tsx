import { useEffect, useState } from "react";
import { type TFunction } from "i18next";
import { Trans } from "react-i18next";
import { useTranslation } from "@/app/i18n/client";
import {
  IconAlertTriangleFilled,
  IconMinus,
  IconMoodSmileFilled,
  IconPlus
} from "@tabler/icons-react";
import { type PrimitiveAtom, atom, useAtom, useAtomValue, useSetAtom, useStore } from "jotai";
import { RESET } from "jotai/utils";
import { atomWithValidate } from "jotai-form";
import * as NodeConfigLib from "@/app/lib/node-config";
import { ToastNotification } from '@/app/[lang]/components';
import { FieldErrorMessage, FieldGroup, TextField } from "@/app/[lang]/components/form";
import { ValidationMessage, isAlgodOK, removeNonNumericalChars } from "@/app/lib/utils";
import { UNIT_NAME_MAX_LENGTH } from "@/app/lib/txn-data/constants";

type Props = {
  /** Language */
  lng?: string,
  /** State function for controlling the state of the dialog (open/closed) */
  setopen: any,
};

const showFormErrorsAtom = atom(false);

/** Content of the body of the "custom node" dialog */
export default function CustomNodeDialogContent({ lng, setopen }: Props) {
  const { t } = useTranslation(lng || '', ['app', 'common']);
  const [toastOpen, setToastOpen] = useState(false);
  const [nodeConfig, setNodeConfig] = useAtom(NodeConfigLib.nodeConfigAtom);
  const [testingNode, setTestingNode] = useState(false);
  const [nodeOK, setNodeOK] = useState<boolean>();
  const [storedCustomNodeConfig, setStoredCustomNodeConfig] = useAtom(NodeConfigLib.customNodeAtom);
  const jotaiStore = useStore();
  const form = useAtomValue(NodeConfigLib.customNodeFormControlAtom);
  const setShowFormErrors = useSetAtom(showFormErrorsAtom);
  const [submittingForm, setSubmittingForm] = useState(false);

  /** Extract custom node configuration values from atoms and save it into localStorage */
  const saveCustomNodeConfig = () => {
    setSubmittingForm(true);

    // Check if form (except headers) is valid
    if (!form.isValid) {
      setShowFormErrors(true);
      return;
    };

    let errorInHeaders = false;
    // Check if fields for headers are valid
    jotaiStore.get(NodeConfigLib.headersListAtom).every(headerAtom => {
      const headerName = jotaiStore.get(headerAtom.name);
      const headerValue = jotaiStore.get(headerAtom.value);
      // If this "header name" field is invalid
      if (!headerName.isValid) {
        errorInHeaders = true;
        return false;
      };
      // If this "header value" field is invalid
      if (!headerValue.isValid) {
        errorInHeaders = true;
        return false;
      };
    });

    // Show validation errors and quit if at least one field for the headers is invalid
    if (errorInHeaders) {
      setShowFormErrors(true);
      return;
    }

    // Extract form values from atoms and create object to be put into local storage
    const config = {
      ...form.values,
      headers: jotaiStore.get(NodeConfigLib.headersListAtom)
        .reduce((headerObj: any, headerAtom) => {
          const name = jotaiStore.get(headerAtom.name).value;
          headerObj[name] = jotaiStore.get(headerAtom.value).value ?? '';
          return headerObj;
        }, {})
    };
    const configToBeStored: NodeConfigLib.NodeConfig = {
      network: NodeConfigLib.NetworkId.CUSTOM,
      nodeServer: config.url as string,
      nodePort: config.port,
      nodeToken: config.token as string,
      nodeHeaders: config.headers,
      coinName: config.coinName as string || undefined,
    };
    // Store custom config
    setStoredCustomNodeConfig(configToBeStored);

    // If the currently selected node is the custom node, update that too
    if (nodeConfig.network === NodeConfigLib.NetworkId.CUSTOM) {
      setNodeConfig(configToBeStored);
    }

    setSubmittingForm(false);
    // Close dialog
    setopen(false);
  };

  /** Clears the form field with the given name
   * @param fieldName The name of the field to clear
   */
  const clearFormField = (
    fieldName : 'url' | 'port' | 'token' | 'headers' | 'coinName'
  ) => {
    if (fieldName !== 'headers') {
      form.handleOnChange(fieldName)('');
      form.setFocused(fieldName, false);
      form.setTouched(fieldName, false);
    } else {
      jotaiStore.set(NodeConfigLib.headersListAtom, RESET);
    }
  };

  /** Clear the form and the stored custom configuration */
  const clearCustomNodeConfig = () => {
    // Clear the form
    clearFormField('url');
    clearFormField('port');
    clearFormField('token');
    clearFormField('headers');
    clearFormField('coinName');
    setShowFormErrors(false);

    // Clear stored custom config
    setStoredCustomNodeConfig(RESET);

    // If the currently selected node is the custom node, clear that too
    if (nodeConfig.network === NodeConfigLib.NetworkId.CUSTOM){
      setNodeConfig(RESET);
    }

    // Notify that custom configuration has been cleared
    setToastOpen(true);
  };

  useEffect(() => {
    // If the stored custom configuration has changed because the form was submitted, then the
    // configuration does not need to be loaded from storage.
    if (submittingForm) return;

    // Load custom configuration from storage into the form/atoms
    jotaiStore.set(NodeConfigLib.urlFieldAtom, storedCustomNodeConfig?.nodeServer ?? '');
    jotaiStore.set(NodeConfigLib.portFieldAtom, storedCustomNodeConfig?.nodePort ?? '');
    jotaiStore.set(NodeConfigLib.tokenFieldAtom, storedCustomNodeConfig?.nodeToken as string);
    jotaiStore.set(NodeConfigLib.headersListAtom,
      storedCustomNodeConfig?.nodeHeaders
        ? Object.keys(storedCustomNodeConfig?.nodeHeaders ?? {}).map(
          (headerName: string) => ({
            name: atomWithValidate(headerName, NodeConfigLib.headerNameValidateOptions),
            value: atomWithValidate(
              storedCustomNodeConfig.nodeHeaders?.[headerName] ?? '',
              NodeConfigLib.headerValueValidateOptions
            )
          })
        )
        : []);
    jotaiStore.set(NodeConfigLib.coinNameFieldAtom, storedCustomNodeConfig?.coinName ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedCustomNodeConfig]);

  return (
    // Max height = height of modal (100vh - 5em)
    //                - modal title height if it is 2 lines (2em * 2 lines = 4em)
    //                - modal title bottom margin (1.5em)
    //                - modal box top padding (1.5em)
    //                - modal box bottom padding (1.5em)
    <div className='max-h-[calc(100vh-5em-4em-1.5em-1.5em-1.5em)] overflow-auto px-6 sm:px-8'>
      <form noValidate={true} aria-label={t('node_selector.custom_config.heading')}>
        <p className='max-w-3xl text-sm mb-8'>
          <Trans t={t} i18nKey='node_selector.custom_config.instructions'
            components={{marker: <span className='text-error'>*</span>}}
          />
        </p>
        {/* <NetworkInput t={t} /> */}
        <UrlInput t={t} />
        <PortInput t={t} />
        <TokenInput t={t} />
        <h3 className='mb-0'>{t('node_selector.view_config.headers_heading')}</h3>
        <Headers t={t} />
        <CoinNameInput t={t} />

        {/* Test button */}
        <div className='mt-10'>
          <div className='mb-2 text-center'>
            {nodeOK && <>
              <IconMoodSmileFilled aria-hidden size={20}
                className='me-2 text-success inline align-middle'
              />
              <span className='align-middle'>{t('node_selector.view_config.test_pass')}</span>
            </>}
            {nodeOK === false && <>
              <IconAlertTriangleFilled aria-hidden size={20}
                className='me-2 inline align-middle'
              />
              <span className='align-middle'>{t('node_selector.view_config.test_fail')}</span>
            </>}
          </div>
          <button type='button' className='btn btn-sm btn-block btn-accent'
            onClick={async (e) => {
              e.preventDefault();
              setTestingNode(true);
              setNodeOK(undefined); // Clear test status while testing
              // Convert headers into `Record` object
              const headersObj = jotaiStore.get(NodeConfigLib.headersListAtom)
                .reduce((headerObj: any, headerAtom) => {
                  const name = jotaiStore.get(headerAtom.name).value;
                  headerObj[name] = jotaiStore.get(headerAtom.value).value ?? '';
                  return headerObj;
                }, {});
              // Test
              setNodeOK(await isAlgodOK(
                (form.values.token as string ?? ''),
                (form.values.url as string),
                (form.values.port as number),
                headersObj
              ));
              setTestingNode(false);
            }}
          >
            {testingNode && <span className='loading loading-sm loading-spinner' />}
            {!testingNode && t('node_selector.custom_config.test_btn')}
          </button>
        </div>

        {/* Submit & clear buttons */}
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-3 grid-rows-1 mt-8 mb-1'>
          <div className='sm:col-span-2'>
            <button type='submit' className='btn btn-primary w-full'
              onClick={(e) => { e.preventDefault(); saveCustomNodeConfig(); }}
            >
              {t('node_selector.custom_config.submit_btn')}
            </button>
          </div>
          <div className='sm:col-span-1'>
            <button type='reset' className='btn w-full btn-sm sm:btn-md'
              onClick={(e) => { e.preventDefault(); clearCustomNodeConfig(); }}
            >
              {t('node_selector.custom_config.clear_btn')}
            </button>
          </div>
        </div>
      </form>

      <ToastNotification
        lng={lng}
        message={t('node_selector.custom_config.cleared_msg')}
        open={toastOpen}
        onOpenChange={setToastOpen}
      />
    </div>
  );
}

function UrlInput({ t }: { t: TFunction }) {
  const form = useAtomValue(NodeConfigLib.customNodeFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('node_selector.view_config.url_heading')}
      name='url'
      id='url-input'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder='https://'
      containerId='url-field'
      containerClass='mt-4'
      inputClass={
        ((showFormErrors || form.touched.url) && form.fieldErrors.url) ? 'input-error' : ''
      }
      value={form.values.url ?? ''}
      onChange={(e) => form.handleOnChange('url')(e.target.value)}
      onFocus={form.handleOnFocus('url')}
      onBlur={form.handleOnBlur('url')}
    />
    {(showFormErrors || form.touched.url) && form.fieldErrors.url &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.url.message.key}
        dict={form.fieldErrors.url.message.dict}
      />
    }
  </>);
}

function PortInput({ t }: { t: TFunction }) {
  const form = useAtomValue(NodeConfigLib.customNodeFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('node_selector.view_config.port_heading')}
      name='port'
      id='port-input'
      inputInsideLabel={false}
      placeholder='80'
      containerId='port-field'
      containerClass='mt-4 max-w-xs'
      inputClass={
        ((showFormErrors || form.touched.port) && form.fieldErrors.port) ? 'input-error': ''
      }
      value={form.values.port ?? ''}
      onChange={(e) => {
        const value = removeNonNumericalChars(e.target.value);
        form.handleOnChange('port')(value === '' ? undefined : parseInt(value));
      }}
      onFocus={form.handleOnFocus('port')}
      onBlur={form.handleOnBlur('port')}
      inputMode='numeric'
    />
    {(showFormErrors || form.touched.port) && form.fieldErrors.port &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.port.message.key}
        dict={form.fieldErrors.port.message.dict}
      />
    }
  </>);
}

function TokenInput({ t }: { t: TFunction }) {
  const form = useAtomValue(NodeConfigLib.customNodeFormControlAtom);
  return (
    <TextField label={t('node_selector.view_config.token_heading')}
      name='token'
      id='token-input'
      inputInsideLabel={false}
      containerId='token-field'
      containerClass='mt-4'
      value={form.values.token ?? ''}
      onChange={(e) => form.handleOnChange('token')(e.target.value)}
      onFocus={form.handleOnFocus('token')}
      onBlur={form.handleOnBlur('token')}
    />
  );
}

function Headers({ t }: { t: TFunction }) {
  const [headers, dispatch] = useAtom(NodeConfigLib.headerFieldsAtom);
  return (<>
    {!headers.length &&
      <p className='italic mt-4 mb-0'>{t('node_selector.custom_config.no_headers')}</p>
    }
    {headers.map(
      (headerAtom, i) =>
        <FieldGroup headingLevel={4}
          heading={t('node_selector.custom_config.header_heading', { index: i + 1 })}
          key={`${headerAtom}`}
        >
          <HeaderNameInput t={t} headerAtom={headerAtom} index={i} />
          <HeaderValueInput t={t} headerAtom={headerAtom} index={i} />
        </FieldGroup>
    )}
    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({
          type: 'insert',
          value: {
            name: atomWithValidate('', NodeConfigLib.headerNameValidateOptions),
            value: atomWithValidate('', NodeConfigLib.headerValueValidateOptions)
          }
        })}
      >
        <IconPlus aria-hidden />
        {t('node_selector.custom_config.add_header_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={() => dispatch({ type: 'remove', atom: headers[headers.length - 1] })}
        disabled={!headers.length}
      >
        <IconMinus aria-hidden />
        {t('node_selector.custom_config.remove_header_btn')}
      </button>
    </div>
  </>);
}

function HeaderNameInput({ t, headerAtom, index }:
  { t: TFunction, headerAtom: PrimitiveAtom<NodeConfigLib.HeaderAtomGroup>, index: number }
) {
  const [headerName, setHeaderName] = useAtom(useAtomValue(headerAtom).name);
  const [touched, setTouched] = useState(false);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('node_selector.custom_config.header_name_label', { index: index + 1 })}
      name={`header-name-${index}`}
      id={`header-name-${index}-input`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerId={`header-name-${index}-field`}
      inputClass={((showFormErrors || touched) && !headerName.isValid) ? 'input-error': ''}
      value={headerName.value ?? ''}
      onChange={(e) => setHeaderName(e.target.value)}
      onBlur={() => setTouched(true)}
    />
    {(showFormErrors || touched) && !headerName.isValid &&
      <FieldErrorMessage t={t}
        i18nkey={((headerName.error as any).message as ValidationMessage).key}
        dict={((headerName.error as any).message as ValidationMessage).dict}
      />
    }
  </>);
}

function HeaderValueInput({ t, headerAtom, index }:
  { t: TFunction, headerAtom: PrimitiveAtom<NodeConfigLib.HeaderAtomGroup>, index: number }
) {
  const [headerValue, setHeaderValue] = useAtom(useAtomValue(headerAtom).value);
  return (<>
    <TextField label={t('node_selector.custom_config.header_value_label', { index: index + 1 })}
      name={`header-value-${index}`}
      id={`header-value-${index}-input`}
      inputInsideLabel={false}
      containerId={`header-value-${index}-field`}
      containerClass='mt-4'
      value={headerValue.value ?? ''}
      onChange={(e) => setHeaderValue(e.target.value)}
    />
  </>);
}

function CoinNameInput({ t }: { t: TFunction }) {
  const form = useAtomValue(NodeConfigLib.customNodeFormControlAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  return (<>
    <TextField label={t('node_selector.view_config.coin_name_heading')}
      name='coin_name'
      id='coin_name-input'
      inputInsideLabel={false}
      placeholder={NodeConfigLib.DEFAULT_COIN_NAME}
      containerId='coin_name-field'
      containerClass='mt-2 max-w-xs'
      inputClass={((showFormErrors || form.touched.coinName) && form.fieldErrors.coinName)
          ? 'input-error' : ''
      }
      maxLength={UNIT_NAME_MAX_LENGTH}
      value={form.values.coinName ?? ''}
      onChange={(e) => form.handleOnChange('coinName')(e.target.value)}
      onFocus={form.handleOnFocus('coinName')}
      onBlur={form.handleOnBlur('coinName')}
    />
    {(showFormErrors || form.touched.coinName) && form.fieldErrors.coinName &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.coinName.message.key}
        dict={form.fieldErrors.coinName.message.dict}
      />
    }
  </>);
}
