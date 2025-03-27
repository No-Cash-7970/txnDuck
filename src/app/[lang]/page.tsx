import { use } from 'react';
import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';
import {
  IconBarrierBlockFilled,
  IconBomb,
  IconTriangleSquareCircle,
  IconWand
} from '@tabler/icons-react';
import { useTranslation } from '@/app/i18n';

/** The home page */
export default function HomePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = use(props.params);
  const { t } = use(useTranslation(lang, ['home', 'app', 'common']));
  return (
    <main className='prose max-w-none min-h-screen pb-12'>
      {/* Hero section */}
      <section
        // Fallback background color is included in case gradient, which is set as an image, does
        // not load
        className={'bg-accent text-accent-content bg-gradient-to-r from-accent'
          + ' to-[color-mix(in_oklab,oklch(var(--a)),oklch(var(--bc)))] '
          + ' py-10 sm:py-12 md:py-20 px-8 font-display'
        }
      >
        <div className='max-w-5xl mx-auto text-center'>
          <p className='text-3xl sm:text-4xl font-bold my-0'>{t('home:hero.main_paragraph')}</p>
          <Link data-testid='startBtn' href={`${lang}/txn`}
            className={
              'btn btn-lg btn-block h-auto py-2 mt-8 sm:mt-10 md:mt-14 leading-6 shadow-2xl'
              + ' btn-primary border-2 border-opacity-50 border-primary-content'
              + ' hover:bg-primary-content hover:text-primary hover:border-primary'
            }
          >
            <IconWand aria-hidden />
            {t('home:hero.start_button')}
          </Link>
        </div>
      </section>

      {/* Additional information section */}
      <section className='max-w-6xl mx-auto px-6'>
        {/* What is it? */}
        <h2 id='what-is-this'>{t('home:what_is_this.heading')}</h2>
        <p>{t('home:what_is_this.paragraph')}</p>

        {/* How It Works */}
        <h2 id='how-it-works'>{t('home:how_it_works.heading')}</h2>
        <div className='grid md:grid-cols-3 gap-2 lg:gap-4'>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:how_it_works.compose.heading')}
              </h3>
              <p className='self-start md:mb-4'>{t('home:how_it_works.compose.paragraph')}</p>
              <Link data-testid='composeTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2'
                href={`${lang}/txn/compose`}
                prefetch={false}
              >
                {t('home:how_it_works.compose.button')}
              </Link>
            </div>
          </div>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:how_it_works.sign.heading')}
              </h3>
              <p className='self-start md:mb-4'>{t('home:how_it_works.sign.paragraph')}</p>
              <Link data-testid='signTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2'
                href={`${lang}/txn/sign?import`}
                prefetch={false}
              >
                {t('home:how_it_works.sign.button')}
              </Link>
            </div>
          </div>
          <div className='card bg-base-200 prose-headings:text-accent'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                {t('home:how_it_works.send.heading')}
              </h3>
              <p className='self-start md:mb-4'>{t('home:how_it_works.send.paragraph')}</p>
              <Link data-testid='sendTxnBtn'
                className='btn btn-accent btn-sm h-auto p-2'
                href={`${lang}/txn/send?import`}
                prefetch={false}
              >
                {t('home:how_it_works.send.button')}
              </Link>
            </div>
          </div>
        </div>

        {/* Uses */}
        <h2 id='uses'>{t('home:uses.heading')}</h2>
        <div className='grid md:grid-cols-3 gap-2 lg:gap-4'>
          <div className='card border border-success bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                <IconTriangleSquareCircle />
                {t('home:uses.simple_things.heading')}
              </h3>
              <ul className='self-start marker:text-success'>
                <li>
                  <Link href={`${lang}/txn/compose?preset=transfer`} className='link'>
                    {t('home:uses.simple_things.list.0')}
                  </Link>
                </li>
                <li>
                  <Link href={`${lang}/txn/compose?preset=asset_opt_in`} className='link'>
                    <Trans t={t} i18nKey='home:uses.simple_things.list.1'>
                      opt_in_to_<abbr title={t('algo_std_asset')}>asa</abbr>
                    </Trans>
                  </Link>
                </li>
                <li>
                  <Link href={`${lang}/txn/compose?preset=asset_transfer`} className='link'>
                    <Trans t={t} i18nKey='home:uses.simple_things.list.2'>
                      transfer_<abbr title={t('nonfungible_token')}>nft</abbr>
                    </Trans>
                  </Link>
                </li>
                <li>{t('home:uses.simple_things.list.3')}</li>
              </ul>
            </div>
          </div>
          <div className='card border border-warning bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                <IconBarrierBlockFilled aria-hidden />
                {t('home:uses.complex_things.heading')}
              </h3>
              <ul className='self-start marker:text-warning'>
                <li>
                  <Link href={`${lang}/txn/compose?preset=reg_online`} className='link'>
                    {t('home:uses.complex_things.list.0')}
                  </Link>
                </li>
                <li>
                  <Link href={`${lang}/txn/compose?preset=app_update`} className='link'>
                    {t('home:uses.complex_things.list.1')}
                  </Link>
                </li>
                <li>
                  <Link href={`${lang}/txn/compose?preset=asset_clawback`} className='link'>
                    {t('home:uses.complex_things.list.2')}
                  </Link>
                </li>
                <li>{t('home:uses.complex_things.list.3')}</li>
              </ul>
            </div>
          </div>
          <div className='card border border-error bg-opacity-80'>
            <div className='card-body items-center px-4 py-6'>
              <h3 className='card-title self-start mt-0'>
                <IconBomb aria-hidden />
                {t('home:uses.dangerous_things.heading')}
              </h3>
              <ul className='self-start marker:text-error'>
                <li>
                  <Link href={`${lang}/txn/compose?preset=rekey_account`} className='link'>
                    {t('home:uses.dangerous_things.list.0')}
                  </Link>
                </li>
                <li>
                  <Link href={`${lang}/txn/compose?preset=close_account`} className='link'>
                    {t('home:uses.dangerous_things.list.1')}
                  </Link>
                </li>
                <li>{t('home:uses.dangerous_things.list.2')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
