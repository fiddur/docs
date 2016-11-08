/* global $ */

export default function initSampleBox() {
  const $sampleBox = $('#package');
  const $sampleRequirements = $sampleBox.find('.package-requirements');
  const $requirementsToggle = $sampleBox.find('.package-requirements-toggle');
  const $requirementsToggleText = $requirementsToggle.find('.text');
  const $requirementsToggleIcon = $requirementsToggle.find('.icon');
  let requirementsOpen = false;

  if (!$sampleBox || !$sampleRequirements || $sampleBox.data('configured')) return;

  $($requirementsToggle).on('click', () => {
    requirementsOpen = !requirementsOpen;
    $($sampleRequirements).slideToggle(200);
    $($requirementsToggleText).text(`${requirementsOpen ? 'Hide' : 'Show'} requirements`);
    $($requirementsToggleIcon).toggleClass('icon-budicon-460 icon-budicon-462');
  });

  $sampleBox.data('configured', true);
}
