'use client';

import { Trans } from 'react-i18next';
import { useTranslation } from '@/app/i18n/client';
import Link from 'next/link';

export default function HomePage({ params: { lang } }: {
  params: { lang: string }
}) {
  const I18N_NS = 'home_page'; // Namespace for translations
  const { t } = useTranslation(lang, I18N_NS);

  return (
    <main className="prose max-w-none min-h-screen pb-12">
      {/* Hero section */}
      <section
        className={'bg-gradient-to-r from-accent to-accent-focus text-accent-content'
          + ' py-12 sm:py-20 px-8'
          + ' font-display'
        }
      >
        <div className='max-w-5xl mx-auto'>
          <p className='text-4xl mt-0 font-bold mb-4'>{t('hero.main_paragraph')}</p>
          <p className='text-3xl mb-16'>{t('hero.sub_paragraph')}</p>
          <Link data-testid='startBtn'
            className={'btn btn-primary btn-lg btn-block'
              + ' shadow-xl border-none'
              + ' bg-gradient-to-r from-primary-focus to-primary'
              + ' hover:from-secondary-focus hover:to-secondary hover:text-secondary-content'
            }
            href={`${lang}/txn`}
          >
            {t('hero.start_button')}
          </Link>
        </div>
      </section>

      {/* Additional information section */}
      <section className='max-w-6xl mx-auto px-6'>
        {/* How It Works */}
        <h2 id='how-it-works'>{t('how_it_works.heading')}</h2>
        <div className='grid md:grid-cols-3 gap-2 lg:gap-4'>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6"'>
              <h3 className='card-title self-start mt-0'>{t('how_it_works.compose.heading')}</h3>
              <p className='self-start md:mb-4'>{t('how_it_works.compose.paragraph')}</p>
              <Link data-testid='composeTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2'
                href={`${lang}/txn`}
              >
                {t('how_it_works.compose.button')}
              </Link>
            </div>
          </div>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6"'>
              <h3 className='card-title self-start mt-0'>{t('how_it_works.sign.heading')}</h3>
              <p className='self-start md:mb-4'>{t('how_it_works.sign.paragraph')}</p>
              <Link data-testid='signTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2 btn-disabled'
                href={`${lang}/txn/sign`}
                aria-disabled
              >
                {t('how_it_works.sign.button')}
              </Link>
            </div>
          </div>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6"'>
              <h3 className='card-title self-start mt-0'>{t('how_it_works.send.heading')}</h3>
              <p className='self-start md:mb-4'>{t('how_it_works.send.paragraph')}</p>
              <Link data-testid='sendTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2 btn-disabled'
                href={`${lang}/txn/send`}
                aria-disabled
              >
                {t('how_it_works.send.button')}
              </Link>
            </div>
          </div>
        </div>

        {/* Uses */}
        <h2 id='uses'>{t('uses.heading')}</h2>
        <div className='grid md:grid-cols-3 gap-2 lg:gap-4'>
          <div className='card border-2 border-success bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>{t('uses.simple_things.heading')}</h3>
              <ul className='self-start marker:text-success'>
                <li>{t('uses.simple_things.list.0')}</li>
                <li>
                  <Trans i18nKey='uses.simple_things.list.1' ns={I18N_NS}>
                    opt_in_to_<abbr title={t('algo_std_asset')}>asa</abbr>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey='uses.simple_things.list.2' ns={I18N_NS}>
                    transfer_<abbr title={t('nonfungible_token')}>nft</abbr>
                  </Trans>
                </li>
                <li>{t('uses.simple_things.list.3')}</li>
              </ul>
            </div>
          </div>
          <div className='card border-2 border-warning bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>{t('uses.complex_things.heading')}</h3>
              <ul className='self-start marker:text-warning'>
                <li>{t('uses.complex_things.list.0')}</li>
                <li>{t('uses.complex_things.list.1')}</li>
                <li>{t('uses.complex_things.list.2')}</li>
                <li>{t('uses.complex_things.list.3')}</li>
              </ul>
            </div>
          </div>
          <div className='card border-2 border-error bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>{t('uses.dangerous_things.heading')}</h3>
              <ul className='self-start marker:text-error'>
                <li>{t('uses.dangerous_things.list.0')}</li>
                <li>{t('uses.dangerous_things.list.1')}</li>
                <li>{t('uses.dangerous_things.list.2')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
