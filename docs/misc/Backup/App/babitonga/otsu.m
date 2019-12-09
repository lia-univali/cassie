bucketMeans = data(:, 1);
histogramCounts = data(:, 2);
total = sum(histogramCounts); % '''total''' is the number of pixels in the given image. 
%% OTSU automatic thresholding method
sumB = 0;
wB = 0;
maximum = 0.0;
sum1 = dot(bucketMeans, histogramCounts);
for ii=1:size(histogramCounts, 1)
    wB = wB + histogramCounts(ii);
    wF = total - wB;
    if (wB == 0 || wF == 0)
        continue;
    end
    sumB = sumB +  bucketMeans(ii) * histogramCounts(ii);
    mF = (sum1 - sumB) / wF;
    between = wB * wF * ((sumB / wB) - mF) * ((sumB / wB) - mF);
    if ( between >= maximum )
        level = ii;
        maximum = between;
    end
end

maximum = 0.0
maxRight = 0.0
for k=level:size(histogramCounts, 1)
  if (histogramCounts(k) > maximum)
    maximum = histogramCounts(k);
    maxRight = k;
  end
end

maximum = 0.0
maxLeft = 0.0
for k=1:level
  if (histogramCounts(k) > maximum)
    maximum = histogramCounts(k);
    maxLeft = k;
  end
end

bucketMeans(maxLeft)
bucketMeans(maxRight)

minimum = max(histogramCounts(maxLeft), histogramCounts(maxRight))
thresh = 0.0
for k=maxLeft:maxRight
  if (histogramCounts(k) < minimum)
    minimum = histogramCounts(k);
    thresh = k;
  end
end

bucketMeans(thresh)
minimum
  